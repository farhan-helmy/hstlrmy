interface WhatsappData {
  name: string;
  phone_number: string;
}


export const sendWhatsapp = async (whatsappData: WhatsappData) => {
  try {
    const whatsappTemplate = `Hi leads masuk ${whatsappData.name} - ${whatsappData.phone_number}`;

    const response = await fetch("https://graph.facebook.com/v15.0/115587218070665/messages", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`
      },
      body: '{"messaging_product":"whatsapp","to":"60102848584","type":"text","text":{"body":"' + whatsappTemplate + '"}}'
    })
    const data = await response.json()
    return data?.messageId

  } catch (error: any) {
    console.log("ERROR", error.message);
    return { ok: false, msg: "Failed to send whatsapp" };
  }
};

export const sendOrderWhatsapp = async (orderData: any) => {
  try {
    const whatsappTemplate = `${orderData.name} dengan barang ${orderData.item}`;

    const response = await fetch("https://graph.facebook.com/v15.0/115587218070665/messages", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.WHATSAPP_API_TOKEN}`
      },
      body: '{"messaging_product":"whatsapp","recipient_type":"individual","to":"60143381756","type":"template","template":{"name":"sample_purchase_feedback","language":{"code":"EN_US"},"components":[{"type":"header","parameters":[{"type":"image","image":{"link":"https://hustlermy.s3.ap-southeast-1.amazonaws.com/next-s3-uploads/065a8483-b1ea-4784-a575-2b985094aada/Screenshot-2022-12-15-at-3.21.00-PM.png"}}]},{"type":"body","parameters":[{"type":"text","text":"'+ whatsappTemplate +'"}]}]}}'
    })

    const data = await response.json()
    return data?.messageId
  } catch (e: any) {
    console.log("ERROR", e.message);
    return { ok: false, msg: "Failed to send whatsapp" };
  }
}



