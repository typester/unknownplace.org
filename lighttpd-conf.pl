#!/usr/bin/env perl

use strict;
use warnings;
use FindBin;

print <<"__CONF__";
server.document-root = "$FindBin::Bin/public"
__CONF__
