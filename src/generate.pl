#!/usr/local/bin/perl

# TODO: exclude js02 and other non-standard stroke numbers

# 次のようなファーマットのJSON形式に変換する
# {
#   "一": {
#     "strokes": 1,
#     "kanji": ["丂", "丄", "丅", "丌", "丒", ...]
#   },
#   ...
# }

use strict;
use warnings;

open(my $radkfile, '<:encoding(euc-jp)', $ARGV[0]) or die "Could not open $ARGV[0]\n";
open(my $output, '>:encoding(utf-8)', 'output.json') or die "Could not open output.json for writing\n";

sub main {
  my $currentRadical = undef;
  my $numStrokes = undef;
  my @relatedKanji = undef;

  print $output '{';

  while (my $line = <$radkfile>) {
    next if $line =~ /^#/; # skip comments

    if ($line =~ /^\$/) {
      outputRadical($currentRadical, $numStrokes, @relatedKanji, 0);

      my @matches = ($line =~ /^\$ (.) (\d+)/);

      die "Error while parsing $line\n" if !@matches || @matches != 2;

      ($currentRadical, $numStrokes) = @matches;
      @relatedKanji = ();
    } else {
      chomp($line);
      push(@relatedKanji, split('', $line));
    }
  }

  outputRadical($currentRadical, $numStrokes, @relatedKanji, 1);

  print $output '}';
}

sub outputRadical {
  my $isLast = pop(@_);
  my ($radical, $strokes, @kanji) = @_;

  return unless $radical;

  print $output sprintf(
    '"%s":{"strokes":%d,"kanji":[%s]}',
    $radical,
    $strokes,
    @kanji ? '"' . join('","', @kanji) . '"' : ''
  );

  print $output ',' unless $isLast;
}

main();

close($radkfile);
close($output);
