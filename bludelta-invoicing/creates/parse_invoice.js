const fetch = require("cross-fetch")
const http = require('https');

const FormData = require('form-data');

function simplifyStructure(s) {
    var r = {}
    for (var item in s) {
        if (Array.isArray(s[item])) {
            r[item] = []
            for (var i = 0; i < s[item].length; i++) {
                if (s[item][i].Value) {
                    r[item].push(s[item][i].Value)
                }
            }
        } else if (s[item].Value !== undefined) {
            r[item] = s[item].Value
        }
    }
    return r
}

const perform = async (z, bundle) => {

    // Download file and convert to base64
    const resp = await fetch(bundle.inputData.file);
    const content = await resp.buffer();
    const data = content.toString("base64");


    const response = await z.request({
        url: 'https://api.bludelta.ai/v1-18/invoicedetail/detect',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-ApiKey': bundle.authData.api_key //'KovtJ/F/owtWfADUgE/0YvJO5YoBF3Qoi6VFuxiJ06vPCVdWHpuTQHinQ32ZI2DVsBeGjm25zVTrPNYhjvchwg==' //bundle.authData.api_key,
        },
        body: {
            "Filter": parseInt(bundle.inputData.filter),
            "Invoice": data,
        },

    });

    const d = response.data
    var r = {
        "DocumentResolution": d.DocumentResolution,
        "DocumentFormat": d.DocumentFormat,
        "Language": d.Language,
        "Countries": d.Countries,
        "Sender": {},
        "Receiver": {},
        "InvoiceDetailTypePredictions": {},
        "IsQualityOk": d.IsQualityOk,
        "InvoiceState": d.InvoiceState,
        "Confidence": d.Confidence
    }

    if (d.Sender) {
        r.Sender = simplifyStructure(d.Sender)
        if (d.Sender.Address) {
            r.Sender.Address = simplifyStructure(d.Sender.Address)
        }
    }
    if (d.Receiver) {
        r.Receiver = simplifyStructure(d.Receiver)
        if (d.Receiver.Address) {
            r.Receiver.Address = simplifyStructure(d.Receiver.Address)
        }
    }
    if (Array.isArray(d.InvoiceDetailTypePredictions)) {
        for (var i = 0; i < d.InvoiceDetailTypePredictions.length; i++) {
            r.InvoiceDetailTypePredictions[d.InvoiceDetailTypePredictions[i].TypeName] = d.InvoiceDetailTypePredictions[i].Value
        }
    }

    return r
};

module.exports = {
    key: 'parse_invoice',
    noun: 'Invoice',
    display: {
        label: 'Parse Invoice',
        description: 'Parses an invoice '
    },
    operation: {
        inputFields: [{
                key: 'file',
                required: true,
                type: 'file',
                label: 'File'
            },
            {
                key: 'filter',
                required: true,
                type: 'string',
                label: 'Filter',
                choices: {
                    0: "None",
                    2: "Sender"
                },
            }
        ],
        perform,
        sample: {
          "DocumentResolution":200,
          "DocumentFormat":"Letter",
          "Language":"de",
          "Countries":"CH",
          "Sender":{
             "Name":"Invoice Sender",
             "WebsiteUrl":[
                
             ],
             "Email":[
                
             ],
             "Phone":"",
             "Fax":"",
             "Address":{
                "Street":"XY",
                "ZipCode":"8000",
                "City":"Zürich",
                "Country":"CH"
             }
          },
          "Receiver":{
             "Name":"Receiver Name",
             "WebsiteUrl":[
                
             ],
             "Email":[
                
             ],
             "Phone":"",
             "Fax":"",
             "Address":{
                "Street":"Street",
                "ZipCode":"8000",
                "City":"Zürich",
                "Country":"CH"
             }
          },
          "InvoiceDetailTypePredictions":{
             "DocumentType":"Invoice",
             "InvoiceId":"41408",
             "SenderOrderId":"",
             "CustomerId":"",
             "InvoiceDate":"2022-06-22",
             "SenderOrderDate":"",
             "ReceiverOrderDate":"",
             "DeliveryDate":"",
             "Bic":"",
             "NetTotalAmount":"379.50",
             "VatTotalAmount":"29.20",
             "VatExemption":"",
             "ReceiverOrderId":"",
             "DeliveryNoteId":"",
             "Iban":"CHXXX",
             "GrandTotalAmount":"408.70",
             "IsrReference":"256XXX",
             "InvoiceCurrency":"CHF",
             "CompanyRegistrationNumber":"",
             "CostCenter":"",
             "KId":"",
             "TaxNumber":"",
             "ReceiverVatId":"",
             "SenderVatId":"",
             "IsrSubscriber":"",
             "Sender":"Sender Name"
          },
          "IsQualityOk":true,
          "InvoiceState":0,
          "Confidence":0
       },
    },
};