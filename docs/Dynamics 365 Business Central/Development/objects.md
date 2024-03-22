---
sidebar_position: 20
sidebar_label : "Discover the logical database and its objects"
---
# Discover the logical database and its objects

Dynamics 365 Business Central is built, like many other cloud applications, on top of a database. This database doesn't only contain the data (like customers, vendors, products, and so on.); it also contains every object that is used in the application. When you request customer data, this data is displayed as a page on the screen with a certain structure.

Business Central's database also stores the structure of this page, which allows developers to add and modify existing objects and deploy new solutions quickly. You do not need to build a new version of the product when you want to change the position of certain input fields on the screen.

Every solution is built on one or more objects. You'll need tables to store your data, pages to present your data, the ability to allow user interaction, reports to present, and the capability of printing data in specific layouts.

With codeunits, you can group functions to be reused in different places. You can use the Query object to query the database, and when you need importing or exporting capabilities in your solution, you'll use the XMLPort object.

The commonly used object types include:

**Table** - Describes how data is stored and how it's retrieved.

**Page** - Enables users to view, add, modify, or delete records in a table.

**Report** - Print, process, or preview the data.

**Codeunit** - Container of programming code. Codeunits are called from other objects to complete a specific task.

**Query** - A relational data model for direct and efficient querying of the underlying database.

**XMLPort** - Imports or exports data in XML or text format.