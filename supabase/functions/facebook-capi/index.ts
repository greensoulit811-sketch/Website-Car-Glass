import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { event_name, event_id, event_source_url, event_time, custom_data, user_data, is_test } = body;

    if (!event_name || !event_id) {
      return new Response(JSON.stringify({ error: 'event_name and event_id required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch settings from database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data: settings, error: settingsError } = await supabase
      .from('site_settings')
      .select('facebook_pixel_id, facebook_capi_enabled, facebook_access_token, facebook_test_event_code, facebook_api_version')
      .limit(1)
      .single();

    if (settingsError || !settings) {
      return new Response(JSON.stringify({ error: 'Could not load settings' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!settings.facebook_capi_enabled) {
      return new Response(JSON.stringify({ message: 'CAPI disabled' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!settings.facebook_access_token || !settings.facebook_pixel_id) {
      return new Response(JSON.stringify({ error: 'Missing Pixel ID or Access Token in settings' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apiVersion = settings.facebook_api_version || 'v21.0';
    const pixelId = settings.facebook_pixel_id;
    const accessToken = settings.facebook_access_token;
    const testEventCode = settings.facebook_test_event_code;

    // Extract first valid IP from x-forwarded-for
    const rawIp = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || '';
    const clientIp = rawIp.split(',')[0]?.trim() || '';

    // Build user_data, only include IP if valid
    const resolvedUserData: Record<string, any> = {
      client_user_agent: req.headers.get('user-agent') || '',
      ...user_data,
    };
    if (clientIp) {
      resolvedUserData.client_ip_address = clientIp;
    }

    // Build event payload
    const eventData: any = {
      event_name,
      event_time: event_time || Math.floor(Date.now() / 1000),
      event_id,
      event_source_url: event_source_url || '',
      action_source: 'website',
      user_data: resolvedUserData,
    };

    if (custom_data && Object.keys(custom_data).length > 0) {
      eventData.custom_data = custom_data;
    }

    const payload: any = {
      data: [eventData],
    };

    // Use test event code if provided and is_test
    if (testEventCode && (is_test || testEventCode)) {
      payload.test_event_code = testEventCode;
    }

    const url = `https://graph.facebook.com/${apiVersion}/${pixelId}/events?access_token=${accessToken}`;

    const metaResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await metaResponse.json();

    if (!metaResponse.ok) {
      console.error('Meta CAPI error:', JSON.stringify(result));
      return new Response(JSON.stringify({ error: 'Meta API error', details: result }), {
        status: metaResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, result }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('CAPI function error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
