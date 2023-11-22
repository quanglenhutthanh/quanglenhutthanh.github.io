---
sidebar_position: 20
sidebar_label : "Project: Exploring Near-Earth Objects"
---

# Project: Exploring Near-Earth Objects

In this project, you'll use Python - and the skills we've developed throughout this course - to search for and explore close approaches of near-Earth objects (NEOs), using data from NASA/JPL's Center for Near-Earth Object Studies.

Source code: https://github.com/quanglenhutthanh/Near-Earth_Project

## Overview

At a high-level, you'll create Python code that implements a command-line tool to inspect and query a dataset of NEOs and their close approaches to Earth.

Concretely, you'll have to read data from both a CSV file and a JSON file, convert that data into structured Python objects, perform filtering operations on the data, limit the size of the result set, and write the results to a file in a structured format, such as CSV or JSON.

When complete, you'll be able to inspect the properties of the near-Earth objects in the data set and query the data set of close approaches to Earth using any combination of the following filters:

- Occurs on a given date.
- Occurs on or after a given start date.
- Occurs on or before a given end date.
- Approaches Earth at a distance of at least (or at most) X astrononical units.
- Approaches Earth at a relative velocity of at least (or at most) Y kilometers per second.
- Has a diameter that is at least as large as (or at least as small as) Z kilometers.
- Is marked by NASA as potentially hazardous (or not).

By completing this project, you'll have demonstrated an ability to:

- Represent structured data in Python.
- Extract data from structured files into Python.
- Transform the data within Python according to some desired behavior.
- Save the results in a structured way to a file.

Along the way, you'll have to be able to:

- Write Python functions to transform data and perform algorithms.
- Design Python classes to encapsulate useful data types.
- Provide interface abstractions for complex implementations.

## Understanding the Near-Earth Object Close Approach Datasets

This project contains two important datasets.

One dataset (neos.csv) contains information about semantic, physical, orbital and model parameters for certain small bodies (asteroids and comets, mostly) in our solar system. The other dataset (cad.json) contains information about NEO close approaches - moments in time when the orbit of an astronomical body brings it close to Earth.

## Description

### Understanding Project Tasks

**Task 0** : Inspect the data. (`neo.csv` and `cad.json`)

**Task 1** : build model to represent the data. (`models.py`)

The first thing we'll do is create Python objects to represent our data. In particular, we're going to create two classes in the models.py file:

- A NearEarthObject class, to represent the data for a single near-Earth object.
- A CloseApproach class, to represent the data for a single close approach of an NEO.

**Task 2** : Extract data from structured files into Python objects.

- In `extract.py`, we'll write functions that takes the paths to our data files and extract structured data.
- In `database.py`, we'll capture this data in an NEODatabase, precompute auxiliary data structures, interconnect the NearEarthObjects and CloseApproaches, and provide the ability to fetch NEOs by designation or by name.

**Task 3:** Query close approaches with user-specified criteria.

You'll implement the `create\_filters` function in the filters.py file.

Query the database of close approaches using user-specified criteria. (`database.py`).

**Task 4** : Report the results (write.py)

- `write\_to\_csv`: Write a stream of CloseApproach objects to a specific CSV file.
- `write\_to\_json`: Write a stream of CloseApproach objects to a specific JSON file.

## Coding Style

Produce python code that satisfie PEP 8. You can install pycodestyle with `pip install pycodestyle` and check your code with `pycodestyle ./`

Write python comments that satisfy PEP-0257. You can install pydocstyle with `pip install pydocstyle` and check your code with `pydocstyle ./`

## Getting Started

### Prerequisites

Using Python 3.8 or later, install the required packages listed in requirements.txt using pip or your favorite package manager

### Installation

`pip install -r requirements.txt`

## Usage

This project is driven by the `main.py` script. That means that you'll run `python3 main.py ... ... ...` at the command line to invoke the program that will call your code.

At a command line, you can run `python3 main.py --help` for an explanation of how to invoke the script.

```cmd
usage: main.py [-h] [--neofile NEOFILE] [--cadfile CADFILE] {inspect,query,interactive} ...
Explore past and future close approaches of near-Earth objects.

positional arguments:
  {inspect,query,interactive}

optional arguments:
  -h, --help            show this help message and exit
  --neofile NEOFILE     Path to CSV file of near-Earth objects.
  --cadfile CADFILE     Path to JSON file of close approach data.


```
The `inspect` subcommand inspects a single NEO, printing its details in a human-readable format. The NEO is specified with exactly one of the --pdes option (the primary designation) and the --name option (the IAU name). The --verbose flag additionally prints out, in a human-readable form, all known close approaches to Earth made by this NEO. Each of these options has an abbreviated version.

```
$ python3 main.py inspect --help
usage: main.py inspect [-h] [-v] (-p PDES | -n NAME)
Inspect an NEO by primary designation or by name.

Example:

# Inspect the NEO with a primary designation of 433 (that's Eros!)
$ python3 main.py inspect --pdes 433
NEO 433 (Eros) has a diameter of 16.840 km and is not potentially hazardous.

# Inspect the NEO with an IAU name of "Halley" (that's Halley's Comet!)
$ python3 main.py inspect --name Halley
NEO 1P (Halley) has a diameter of 11.000 km and is not potentially hazardous.

```
The `query` subcommand is significantly more advanced - a query generates a collection of close approaches that match a set of specified filters, and either displays a limited set of those results to standard output or writes the structured results to a file.

```
$ python3 main.py query --help
usage: main.py query [-h] [-d DATE] [-s START_DATE] [-e END_DATE] [--min-distance DISTANCE_MIN] [--max-distance DISTANCE_MAX]
                     [--min-velocity VELOCITY_MIN] [--max-velocity VELOCITY_MAX] [--min-diameter DIAMETER_MIN]
                     [--max-diameter DIAMETER_MAX] [--hazardous] [--not-hazardous] [-l LIMIT] [-o OUTFILE]

Example:
# Show (the first) three close approaches on July 29th, 1969.
$ python3 main.py query --date 1969-07-29 --limit 3
On 1969-07-29 01:47, '408982' approaches Earth at a distance of 0.36 au and a velocity of 24.24 km/s.
On 1969-07-29 13:33, '2010 MA' approaches Earth at a distance of 0.21 au and a velocity of 8.80 km/s.
On 1969-07-29 19:56, '464798' approaches Earth at a distance of 0.10 au and a velocity of 8.02 km/s.

# Show (the first) three close approaches in 2050.
$ python3 main.py query --start-date 2050-01-01 --limit 3
On 2050-01-01 04:18, '2019 AY9' approaches Earth at a distance of 0.31 au and a velocity of 8.31 km/s.
On 2050-01-01 06:00, '162361' approaches Earth at a distance of 0.19 au and a velocity of 9.08 km/s.
On 2050-01-01 09:55, '2009 LW2' approaches Earth at a distance of 0.04 au and a velocity of 19.02 km/s.


```

There's a third useful subcommand named `interactive`. This subcommand first loads the database and then starts a command loop so that you can repeatedly run inspect and query subcommands on the database without having to wait to reload the data each time you want to run a new command, which saves an extraordinary amount of time. This can be extremely helpful, as it lets you speed up your development cycle and even show off the project more easily to friends.

```
$ python3 main.py interactive

Explore close approaches of near-Earth objects. Type `help` or `?` to list commands and `exit` to exit.
(neo) inspect --pdes 433
NEO 433 (Eros) has a diameter of 16.840 km and is not potentially hazardous.
(neo) help i
Shorthand for `inspect`.
(neo) i --name Halley
NEO 1P (Halley) has a diameter of 11.000 km and is not potentially hazardous.
(neo) query --date 2020-12-31 --limit 2
On 2020-12-31 05:48, '2010 PQ10' approaches Earth at a distance of 0.45 au and a velocity of 21.69 km/s.
On 2020-12-31 16:00, '2015 YA' approaches Earth at a distance of 0.17 au and a velocity of 5.65 km/s.
(neo) q --date 2021-3-14 --min-velocity 10
On 2021-03-14 06:17, '2019 DS1' approaches Earth at a distance of 0.39 au and a velocity of 20.17 km/s.
On 2021-03-14 20:19, '483656' approaches Earth at a distance of 0.06 au and a velocity of 12.09 km/s.
...


```
