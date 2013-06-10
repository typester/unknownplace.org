package blosxom;
use strict;
use warnings;
use File::Basename;

our $blog_title    = 'unknownplace.org';
our $blog_encoding = 'utf-8';

our $datadir          = "$ENV{HOME}/Dropbox/blosxom";
our $plugin_dir       = dirname(__FILE__) . "/plugins";
our $plugin_state_dir = dirname(__FILE__) . "/plugins/state";
