import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    // 1. التحقق من هوية المستخدم
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "غير مصرح - يرجى تسجيل الدخول" },
        { status: 401 },
      );
    }

    // 2. قراءة البيانات المرسلة من الواجهة
    const body = await request.json();

    // 3. الاتصال بـ Adsterra API
    // ملاحظة: هذا مثال، استبدل بالـ endpoint الصحيح من Adsterra
    const adsterraResponse = await fetch(
      "https://api.adsterra.com/v2/your-endpoint",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ADSTERRA_API_KEY}`, // مفتاح API من Adsterra
        },
        body: JSON.stringify({
          token: body.token,
          user_id: user.id,
          // أضف أي بيانات أخرى تحتاجها Adsterra
        }),
      },
    );

    // 4. معالجة الاستجابة من Adsterra
    const data = await adsterraResponse.json();

    // 5. (اختياري) تسجيل الطلب في قاعدة البيانات
    await supabase.from("api_logs").insert({
      user_id: user.id,
      endpoint: "/api/adsterra",
      request: body,
      response: data,
      created_at: new Date().toISOString(),
    });

    // 6. إعادة النتيجة للواجهة
    return NextResponse.json(data);
  } catch (error) {
    console.error("Adsterra API Error:", error);
    return NextResponse.json(
      { error: "حدث خطأ في معالجة الطلب" },
      { status: 500 },
    );
  }
}
