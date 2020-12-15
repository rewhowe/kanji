# Kradfile に存在するかを判断する

package Kradfile;

use strict;
use warnings;

use constant KRADFILES => ('kradfile', 'kradfile2');

sub new {
  my ($class, %args) = @_;

  my $self = bless { %args }, $class;

  $self->{kanji} = $self->read($args{directory});

  return $self;
}

sub hasKanji {
  my $self = shift;
  my ($kanji) = @_;

  return exists $self->{kanji}->{$kanji};
}

sub read {
  my $self = shift;
  my ($directory) = @_;

  my %kanjis = ();

  foreach my $filename (KRADFILES) {
    open(my $kradfile, '<:encoding(euc-jp)', $directory . $filename) or die "Could not open $directory$filename\n";

    while (my $line = <$kradfile>) {
      next if $line =~ /^#/; # skip comments

      my @matches = ($line =~ /^(.) : (.+)$/);

      die "Error while parsing $line\n" if !@matches || @matches != 2;

      my $kanji = shift @matches;
      my @radicals = split ' ', shift @matches;
      $kanjis{$kanji} = \@radicals;
    }

    close $kradfile;
  }

  return \%kanjis;
}

1;
