"use strict";(self.webpackChunksrc=self.webpackChunksrc||[]).push([[7455],{6365:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>l,contentTitle:()=>c,default:()=>m,frontMatter:()=>o,metadata:()=>s,toc:()=>a});var r=i(5893),t=i(1151);const o={sidebar_position:10,sidebar_label:"Prebuilt Form Recognizer Models"},c="Prebuilt Form Recognizer Models",s={id:"AI Engineer/Computer Vision/prebuilt-form-recognizer-models",title:"Prebuilt Form Recognizer Models",description:"This demo demonstrates how to use the Azure Form Recognizer Python SDK to extract information from digital documents using the prebuilt Form Recognizer model.",source:"@site/docs/AI Engineer/Computer Vision/prebuilt-form-recognizer-models.md",sourceDirName:"AI Engineer/Computer Vision",slug:"/AI Engineer/Computer Vision/prebuilt-form-recognizer-models",permalink:"/AI Engineer/Computer Vision/prebuilt-form-recognizer-models",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:10,frontMatter:{sidebar_position:10,sidebar_label:"Prebuilt Form Recognizer Models"},sidebar:"tutorialSidebar",previous:{title:"Computer Vision",permalink:"/category/computer-vision"},next:{title:"Custom Form Recognizer Model",permalink:"/AI Engineer/Computer Vision/custom-form-recognizer-model"}},l={},a=[{value:"Introduction",id:"introduction",level:2},{value:"Installation",id:"installation",level:2},{value:"Python SDK Demo",id:"python-sdk-demo",level:2}];function d(e){const n={blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,t.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.h1,{id:"prebuilt-form-recognizer-models",children:"Prebuilt Form Recognizer Models"}),"\n",(0,r.jsx)(n.p,{children:"This demo demonstrates how to use the Azure Form Recognizer Python SDK to extract information from digital documents using the prebuilt Form Recognizer model."}),"\n",(0,r.jsxs)(n.blockquote,{children:["\n",(0,r.jsxs)(n.p,{children:["Form Recognizer is now ",(0,r.jsx)(n.strong,{children:"Azure AI Document Intelligence"}),"! As of July 2023. But There are no breaking changes to application programming interfaces (APIs) or SDKs."]}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"introduction",children:"Introduction"}),"\n",(0,r.jsx)(n.p,{children:"For certain common types of business or personal documents, which share similar information, Azure Form Recognizer has a few prebuilt models that let us extract information found in these documents:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Receipts"}),"\n",(0,r.jsx)(n.li,{children:"Invoices"}),"\n",(0,r.jsx)(n.li,{children:"Business cards"}),"\n",(0,r.jsx)(n.li,{children:"Identity cards (e.g. driver\u2019s license and passport)"}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:"This code samples shows Prebuilt Receipt operations with Azure Form Recognizer client library."}),"\n",(0,r.jsx)(n.h2,{id:"installation",children:"Installation"}),"\n",(0,r.jsxs)(n.p,{children:["Install the Azure Form Recognizer client for Python with ",(0,r.jsx)(n.code,{children:"pip"})]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-python",children:"!pip install azure-ai-formrecognizer\n"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-python",children:"!pip install azure-core\n"})}),"\n",(0,r.jsx)(n.h2,{id:"python-sdk-demo",children:"Python SDK Demo"}),"\n",(0,r.jsx)(n.p,{children:"Import necessary classes:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-python",children:"from azure.ai.formrecognizer import FormRecognizerClient\nfrom azure.ai.formrecognizer import FormTrainingClient\nfrom azure.core.credentials import AzureKeyCredential\n"})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"FormRecognizerClient"})," and ",(0,r.jsx)(n.code,{children:"FormTrainingClient"})," for working with Azure Form Recognizer."]}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"AzureKeyCredential"})," for providing the authentication credentials."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-python",children:'endpoint = "YOUR_FORM_RECOGNIZER_ENDPOINT"\nkey = "YOUR_FORM_RECOGNIZER_KEY"\n'})}),"\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.code,{children:"endpoint"})," and ",(0,r.jsx)(n.code,{children:"key"})," are  Azure AI Document Intelligence Url and Key, which you can obtain from Azure portal."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-python",children:"form_recognizer_client = FormRecognizerClient(endpoint=endpoint,credential=AzureKeyCredential(key=key))\n"})}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Source Document"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-python",children:'content_url = "https://raw.githubusercontent.com/udacity/cd0461-building-computer-vision-solutions-with-azure-exercises/main/resources/receipt-1.png"\n'})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-python",children:"receipt_content_from_url = form_recognizer_client.begin_recognize_receipts_from_url(content_url)\ncollected_receipts = receipt_content_from_url.result()\n"})}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Processing Results"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-python",children:'def get_receipt_details(receipt):\n    receipt_type = receipt.fields.get("ReceiptType")\n    if receipt_type:\n        print("Receipt Type: {} has confidence: {}".format(receipt_type.value, receipt_type.confidence))\n    merchant_name = receipt.fields.get("MerchantName")\n    if merchant_name:\n        print("Merchant Name: {} has confidence: {}".format(merchant_name.value, merchant_name.confidence))\n    transaction_date = receipt.fields.get("TransactionDate")\n    if transaction_date:\n        print("Transaction Date: {} has confidence: {}".format(transaction_date.value, transaction_date.confidence))\n    if receipt.fields.get("Items"):\n        print("Receipt items:")\n        for idx, item in enumerate(receipt.fields.get("Items").value):\n            print("...Item #{}".format(idx+1))\n            item_name = item.value.get("Name")\n            if item_name:\n                print("......Item Name: {} has confidence: {}".format(item_name.value, item_name.confidence))\n            item_quantity = item.value.get("Quantity")\n            if item_quantity:\n                print("......Item Quantity: {} has confidence: {}".format(item_quantity.value, item_quantity.confidence))\n            item_price = item.value.get("Price")\n            if item_price:\n                print("......Individual Item Price: {} has confidence: {}".format(item_price.value, item_price.confidence))\n            item_total_price = item.value.get("TotalPrice")\n            if item_total_price:\n                print("......Total Item Price: {} has confidence: {}".format(item_total_price.value, item_total_price.confidence))\n    subtotal = receipt.fields.get("Subtotal")\n    if subtotal:\n        print("Subtotal: {} has confidence: {}".format(subtotal.value, subtotal.confidence))\n    tax = receipt.fields.get("Tax")\n    if tax:\n        print("Tax: {} has confidence: {}".format(tax.value, tax.confidence))\n    tip = receipt.fields.get("Tip")\n    if tip:\n        print("Tip: {} has confidence: {}".format(tip.value, tip.confidence))\n    total = receipt.fields.get("Total")\n    if total:\n        print("Total: {} has confidence: {}".format(total.value, total.confidence))\n\n'})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-python",children:"get_receipt_details(collected_receipts[0])\n"})}),"\n",(0,r.jsx)(n.p,{children:"The results will be:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{children:"Receipt Type: Itemized has confidence: 0.995\nMerchant Name: Maximart Store has confidence: 0.973\nTransaction Date: 2021-08-03 has confidence: 0.9\nReceipt items:\n...Item #1\n......Item Name: Hotdog has confidence: 0.984\n......Total Item Price: 2.99 has confidence: 0.986\n...Item #2\n......Item Name: Drink has confidence: 0.984\n......Total Item Price: 3.99 has confidence: 0.98\nSubtotal: 6.98 has confidence: 0.984\nTax: 0.65 has confidence: 0.987\nTotal: 698.0 has confidence: 0.81289\n"})}),"\n",(0,r.jsx)(n.p,{children:"Here are the commonalities among all four prebuild Form Recognizer models:"}),"\n",(0,r.jsx)(n.p,{children:"There are different APIs to access your source documents: either from the URL or from your local disk. The process to collect results is the same for all prebuilt models:"}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Receipt"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{children:"begin_recognize_receipts_from_url\nbegin_recognize_receipts\n"})}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Invoice"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{children:"begin_recognize_invoice_from_url\nbegin_recognize_invoice\n"})}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Business Card"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{children:"begin_recognize_business_cards_from_url\nbegin_recognize_business_cards\n"})}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.strong,{children:"Identity Document"})}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{children:"begin_recognize_identity_documents_from_url\nbegin_recognize_identity_documents\n"})}),"\n",(0,r.jsx)(n.p,{children:"In your RESTful API, you just need to make the minor change in your code to reflect which pre-built model you want to choose:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:["Receipt: ",(0,r.jsx)(n.code,{children:"receipt"})]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:["Invoice: ",(0,r.jsx)(n.code,{children:"invoice"})]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:["Business card: ",(0,r.jsx)(n.code,{children:"businessCard"})]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:["Identity document: ",(0,r.jsx)(n.code,{children:"idDocument"})]}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:"All prebuilt models have a similar API."}),"\n",(0,r.jsx)(n.p,{children:"Check the documentation to understand the fields extracted from each prebuilt model and the locales supported by the model."}),"\n",(0,r.jsx)(n.p,{children:"All API supports synchronous and asynchronous models, so you can choose what is most suitable for your application requirements."}),"\n",(0,r.jsx)(n.p,{children:"The SDK is easier to use than using the RESTful API directly, so if your language-based SDK is available, you should use it."})]})}function m(e={}){const{wrapper:n}={...(0,t.a)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(d,{...e})}):d(e)}},1151:(e,n,i)=>{i.d(n,{Z:()=>s,a:()=>c});var r=i(7294);const t={},o=r.createContext(t);function c(e){const n=r.useContext(o);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function s(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:c(e.components),r.createElement(o.Provider,{value:n},e.children)}}}]);