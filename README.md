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
$ yarn global add @roundtables/awsmfa
```

If you would like to try without installing it first:
```shell
$ npx @roundtables/awsmfa
```

## Usage

### First time

Just run `awsmfa` without arguments and follow through the instructinos

### After the first time

`awsmfa` will provide you with the commandline to directly setup your AWS environment without going through
the interactive steps.

We recommend you add those awsmfa suggested commands as aliases on your system

### Usage examples

```shell
$ awsmfa
```

To run without interactive prompt (useful for setting up aliases)
(in this example, I use the aws sdk's `myclient` profile and my MFA device is linked to the account `999999999999` with a mfaCode `2983`)

```shell
$ awsmfa --profile=myclient --mfaARN=arn:aws:iam::999999999999:mfa/myuser --mfaCode=2983
```

Interactive prompt only for mfaCode (useful for setting up aliases)

```shell
$ awsmfa --profile=myclient --mfaARN=arn:aws:iam::999999999999:mfa/myuser
```

To run a specific command rather than your shell
(in this example `aws2 s3 ls`)

```shell
$ awsmfa --profile=myclient --mfaARN=arn:aws:iam::999999999999:mfa/myuser --mfaCode=2983 aws2 s3 ls
```

To run as a specific role

```shell
$ awsmfa --profile=myclient --mfaARN=arn:aws:iam::999999999999:mfa/myuser --mfaCode=2983 --role=arn:aws:iam::999999999999:role/OrganizationAccountAccessRole
```

To run as a specific role by specifying account and role instead of ARN

```shell
$ awsmfa --profile=myclient --mfaARN=arn:aws:iam::999999999999:mfa/myuser --mfaCode=2983 --account=999999999999 --role=OrganizationAccountAccessRole
```

To assume the role default created `OrganizationAccountAccessRole` role as an SSO method we omit the role and only specify the account

```shell
$ awsmfa --profile=myclient --mfaARN=arn:aws:iam::999999999999:mfa/myuser --mfaCode=2983 --account=999999999999
```

### Help

`awsmfa -h` shows the available arguments.
```shell
awsmfa [--profile=<profile>] [--mfaARN=<mfaARN>] [--mfaCode=<mfacode>] [<command> [<args>...]]
awsmfa -h | --help | --version
```