use strict;
use warnings;
use FindBin;
use Plack::App::Directory;
use Plack::App::WrapCGI;
use File::Basename;

# preload modules
use CGI ();
use Text::MicroTemplate ();
use Data::MessagePack ();
use Time::Piece ();

my $basedir = dirname(__FILE__);

my $blosxom = Plack::App::WrapCGI->new(
    script => "$basedir/blosxom.cgi",
    execute => 1,
)->to_app;

my $static =
    Plack::App::Directory->new({ root => "$basedir/public" })->to_app;

my $app = sub {
    my $env = shift;

    my $file = "$basedir/public" . $env->{PATH_INFO};
    if (-f $file && -r _) {
        return $static->($env);
    }
    else {
        return $blosxom->($env);
    }
};

