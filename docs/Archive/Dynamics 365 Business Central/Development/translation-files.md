---
sidebar_position: 400
sidebar_label : "Working with translation files"
---
# Working with translation files

Dynamics 365 Business Central is multi-language enabled, which means you can display the User Interface in different languages. In Dynamics 365 Business Central, this is done by using XLIFF file, which is a standardized format used computer-based translations.

**XLIFF – XML Localization Interchange File Format**. XLIFF is an XML based format. It was created to standardize the way that localizable data is passed between tools during a localization process, and to serve as a common format for files that are used by computer-aided translation (CAT) tools.

## Generate XLIFF file

In the app.json file of your extension, add the following line:

```

"features": [ "TranslationFile" ]

```

Now, when you run a build command **Ctrl+Shift+B** in Visual Studio Code, a `\Translations` folder is generated and populated with the .xlf file that contains all the labels, label properties, and report labels that you're using in the extension. The generated .xlf file can now be translated.

By setting the `GenerateCaptions` flag in the app.json file, you specify that you want to generate captions based on the object name for pages, tables, reports, XMLports, and request pages. If the object already has a `Caption` property set, that value is used. For the table fields, the `OptionCaption` is used.

```

"features": [ "GenerateLockedTranslations" ]

```

## The XLIFF file

In the generated .xlf file, you can see a `<source>` element for each label. For the translation, you'll now have to add the target-language and a `<target>` element per label. The target-language must be specified in the format `"<language code>-<country code>"`, for example `"da-DK"`, `"es-ES"`, or `"de-DE"`. The `<trans-unit id>` attribute corresponds to the object ID in the extension. This is illustrated in the example below.

```XML
<?xml version="1.0" encoding="utf-8"?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2" xmlns:xsi="https://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:oasis:names:tc:xliff:document:1.2 xliff-core-1.2-transitional.xsd">
    <file datatype="xml" source-language="en-US" target-language="da-DK" original="ALProject16">
    <body>
        <group id="body">
            <trans-unit id="PageExtension 50110" maxWidth="999" size-unit="char" translate="yes" xml:space="preserve">
                <source>Developer translation for %1</source>
                <target>Udvikleroversættelse for %1</target>
                <note from="Developer" annotates="general" priority="2">%1 is extension name</note>
                <note from="Xliff Generator" annotates="general" priority="3">PageExtension - PageExtension</note>
            </trans-unit>
        </group>
    </body>
    </file>
</xliff>

```
> You can have only one .xlf file per language. If you translate your extension to multiple languages, you must have a translation file per language. There is no enforced naming on the file, but it's a good practice to name it `<extensionname>.<language>.xlf`.

## Use NAB extension
Use [NAB AL Tools](https://github.com/jwikman/nab-al-tools/blob/master/extension/README.md) in Visual Studio Code to work with translation files.
