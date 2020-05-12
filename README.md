# awsmfa

The awsmfa command simplifies your process of securing a valid session from a user that has an MFA device.

It walks you through a series of questions and helps restart your shell that has a valid
session. It also suggests a command to run directly in the future.

## Prerequisites

You need nodejs to be installed first.

## Installation

For npm users:

```shell
$ npm i -g @roundtables/awsmfa
```

For yarn users:
```shell
$ npm i -g @roundtables/awsmfa
```

## Usage

### First time

Just run `awsmfa` without arguments and follow through the instructinos

### After the first time

`awsmfa` will provide you with the commandline to directly setup your AWS environment without going through
the interactive steps.

We recommend you add those awsmfa suggested commands as aliases on your system

### Help

`awsmfa -h` shows the available arguments.
```shell
awsmfa [--profile=<profile>] [--mfaARN=<mfaARN>] [--mfaCode=<mfacode>] [<command> [<args>...]]
awsmfa -h | --help | --version
```