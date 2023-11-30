---
sidebar_position: 10
sidebar_label : "Prebuild Form Recognizer"
---
# Prebuild Form Recognizer

This demo demonstrates how to use the Azure Form Recognizer Python SDK to extract information from digital documents using the prebuilt Form Recognizer model.

> Form Recognizer is now **Azure AI Document Intelligence**! As of July 2023. But There are no breaking changes to application programming interfaces (APIs) or SDKs.

## Introduction
For certain common types of business or personal documents, which share similar information, Azure Form Recognizer has a few prebuilt models that let us extract information found in these documents:

-	Receipts	
-	Invoices
-	Business cards
-	Identity cards (e.g. driver’s license and passport)

This code samples shows Prebuild Receipt operations with Azure Form Recognizer client library.


## Installation
Install the Azure Form Recognizer client for Python with `pip`


```python
!pip install azure-ai-formrecognizer
```


```python
!pip install azure-core
```

Import necessary classes:


```python
from azure.ai.formrecognizer import FormRecognizerClient
from azure.ai.formrecognizer import FormTrainingClient
from azure.core.credentials import AzureKeyCredential
```

**FormRecognizerClient** and **FormTrainingClient** for working with Azure Form Recognizer.

**AzureKeyCredential** for providing the authentication credentials.

## Usage


```python
endpoint = "YOUR_FORM_RECOGNIZER_ENDPOINT"
key = "YOUR_FORM_RECOGNIZER_KEY"
```


`endpoint` and `key` are  Azure AI Document Intelligence Url and Key, which you can obtain from Azure portal.


```python
form_recognizer_client = FormRecognizerClient(endpoint=endpoint,credential=AzureKeyCredential(key=key))
```

**Source Document**


```python
content_url = "https://raw.githubusercontent.com/udacity/cd0461-building-computer-vision-solutions-with-azure-exercises/main/resources/receipt-1.png"
```


```python
receipt_content_from_url = form_recognizer_client.begin_recognize_receipts_from_url(content_url)
collected_receipts = receipt_content_from_url.result()
```

**Processing Results**


```python
def get_receipt_details(receipt):
    receipt_type = receipt.fields.get("ReceiptType")
    if receipt_type:
        print("Receipt Type: {} has confidence: {}".format(receipt_type.value, receipt_type.confidence))
    merchant_name = receipt.fields.get("MerchantName")
    if merchant_name:
        print("Merchant Name: {} has confidence: {}".format(merchant_name.value, merchant_name.confidence))
    transaction_date = receipt.fields.get("TransactionDate")
    if transaction_date:
        print("Transaction Date: {} has confidence: {}".format(transaction_date.value, transaction_date.confidence))
    if receipt.fields.get("Items"):
        print("Receipt items:")
        for idx, item in enumerate(receipt.fields.get("Items").value):
            print("...Item #{}".format(idx+1))
            item_name = item.value.get("Name")
            if item_name:
                print("......Item Name: {} has confidence: {}".format(item_name.value, item_name.confidence))
            item_quantity = item.value.get("Quantity")
            if item_quantity:
                print("......Item Quantity: {} has confidence: {}".format(item_quantity.value, item_quantity.confidence))
            item_price = item.value.get("Price")
            if item_price:
                print("......Individual Item Price: {} has confidence: {}".format(item_price.value, item_price.confidence))
            item_total_price = item.value.get("TotalPrice")
            if item_total_price:
                print("......Total Item Price: {} has confidence: {}".format(item_total_price.value, item_total_price.confidence))
    subtotal = receipt.fields.get("Subtotal")
    if subtotal:
        print("Subtotal: {} has confidence: {}".format(subtotal.value, subtotal.confidence))
    tax = receipt.fields.get("Tax")
    if tax:
        print("Tax: {} has confidence: {}".format(tax.value, tax.confidence))
    tip = receipt.fields.get("Tip")
    if tip:
        print("Tip: {} has confidence: {}".format(tip.value, tip.confidence))
    total = receipt.fields.get("Total")
    if total:
        print("Total: {} has confidence: {}".format(total.value, total.confidence))

```


```python
get_receipt_details(collected_receipts[0])
```

The results will be:
```
Receipt Type: Itemized has confidence: 0.995
Merchant Name: Maximart Store has confidence: 0.973
Transaction Date: 2021-08-03 has confidence: 0.9
Receipt items:
...Item #1
......Item Name: Hotdog has confidence: 0.984
......Total Item Price: 2.99 has confidence: 0.986
...Item #2
......Item Name: Drink has confidence: 0.984
......Total Item Price: 3.99 has confidence: 0.98
Subtotal: 6.98 has confidence: 0.984
Tax: 0.65 has confidence: 0.987
Total: 698.0 has confidence: 0.81289
```

Here are the commonalities among all four prebuild Form Recognizer models:

There are different APIs to access your source documents: either from the URL or from your local disk. The process to collect results is the same for all prebuilt models:

**Receipt**
```
begin_recognize_receipts_from_url
begin_recognize_receipts
```

**Invoice**
```
begin_recognize_invoice_from_url
begin_recognize_invoice
```

**Business Card**
```
begin_recognize_business_cards_from_url
begin_recognize_business_cards
```

**Identity Document**
```
begin_recognize_identity_documents_from_url
begin_recognize_identity_documents
```


