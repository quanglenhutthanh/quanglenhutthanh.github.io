---
sidebar_position: 20
sidebar_label : "Prebuilt Form Recognizer Models"
---

# Custom Form Recognizer Model 

Sometimes, the prebuilt models are not sufficient to extract information from you unique documents with particular layout of information. In this case, you should develop your own custom Form Recognizer model to meet your unique business requirements.

## Introduction
The custom Form Recognizer model is a **machine learning model** that is trained from a collection of training documents. During the training phase, the model learns what fields of data you are interested in extracting from the training documents.

> Form Recognizer is now **Azure AI Document Intelligence**! As of July 2023. But There are no breaking changes to application programming interfaces (APIs) or SDKs.

## Installation
Install the Azure Form Recognizer client for Python with `pip`


```python
!pip install azure-ai-formrecognizer
```


```python
!pip install azure-core
```

## Python SDK Demo
Import necessary classes:

```python
from azure.ai.formrecognizer import FormRecognizerClient
from azure.ai.formrecognizer import FormTrainingClient
from azure.core.credentials import AzureKeyCredential
```

`FormRecognizerClient` and `FormTrainingClient` for working with Azure Form Recognizer.

`AzureKeyCredential` for providing the authentication credentials.

```python
endpoint = "YOUR_FORM_RECOGNIZER_ENDPOINT"
key = "YOUR_FORM_RECOGNIZER_KEY"
```

`endpoint` and `key` are  Azure AI Document Intelligence Url and Key, which you can obtain from Azure portal.

### Training Model
```python
form_training_client = FormTrainingClient(endpoint=endpoint,credential=AzureKeyCredential(key=key))
saved_model_list = form_training_client.list_custom_models()
training_process = form_training_client.begin_training(training_files_url=training_data_url,use_training_labels=False)
custom_model = training_process.result()
custom_model_info = form_training_client.get_custom_model(model_id=custom_model.model_id)
print(custom_model.model_id)
print(custom_model.status)
for doc in custom_model.training_documents:
    print("Document name: {}".format(doc.name))
    print("Document status: {}".format(doc.status))
    print("Document page count: {}".format(doc.page_count))
    print("Document errors: {}".format(doc.errors))
```

### Using Model
```python
test_url = "TESTING_DATA_URL"
form_recognizer_client = FormRecognizerClient(endpoint=endpoint,credential=AzureKeyCredential(key=key))
custom_test_action = form_recognizer_client.begin_recognize_custom_forms_from_url(model_id=custom_model_info.model_id, form_url=test_url)
custom_test_action_result = custom_test_action.result()

for recognized_content in custom_test_action_result:
    print("Form type: {}".format(recognized_content.form_type))
    for name, field in recognized_content.fields.items():
        print("Field '{}' has label '{}' with value '{}' and a confidence score of {}".format(
            name,
            field.label_data.text if field.label_data else name,
            field.value,
            field.confidence
        ))

```
