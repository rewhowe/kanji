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

  my %kanji = ();

  return \%kanji;
}

1;
