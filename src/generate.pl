#!/usr/local/bin/perl

# 次のようなファーマットのJSON形式に変換する
# {
#   "一": {
#     "strokes": 1,
#     "standard": true,
#     "kanji": ["丂", "丄", "丅", "丌", "丒", ...]
#   },
#   ...
# }
#
# strokes = 画数（整数）
# standard = 通常の部首かどうか（ブーリアン型）
# kanji = この部首を含む漢字（配列）

use strict;
use warnings;

use feature 'state';

use constant RADKFILES => ('radkfile', 'radkfile2');

die "Usage: generate.pl directory/of/radkfiles/\n" unless $ARGV[0];
open(my $output, '>:encoding(utf-8)', 'radicals.json') or die "Could not open radicals.json for writing\n";

sub main {
  my %radicalData = parseSourceFiles();

  outputJson(\%radicalData);
}

sub parseSourceFiles {
  my %radicalData = ();

  foreach my $filename (RADKFILES) {
    open(my $radkfile, '<:encoding(euc-jp)', $ARGV[0] . $filename) or die "Could not open $ARGV[0]\n";

    while (my $line = <$radkfile>) {
      next if $line =~ /^#/; # skip comments

      processLine(\%radicalData, $line);
    }

    close($radkfile);
  }

  return %radicalData;
}

sub processLine {
  state $currentRadical = undef;

  my ($radicalDataRef, $line) = @_;

  if ($line =~ /^\$/) {
    my @matches = ($line =~ /^\$ (.) (\d+)(.+)?$/);

    die "Error while parsing $line\n" if !@matches || @matches < 2;

    $currentRadical = shift @matches;
    if (! exists $radicalDataRef->{$currentRadical}) {
      $radicalDataRef->{$currentRadical} = makeRadicalData(@matches);
    }
  } elsif (defined $currentRadical) {
    chomp($line);
    push(@{$radicalDataRef->{$currentRadical}->{relatedKanji}}, split('', $line));
  }
}

sub makeRadicalData {
  my ($numStrokes, $nonStandardCode) = @_;

  return {
    numStrokes   => $numStrokes,
    isStandard   => ! defined $nonStandardCode,
    relatedKanji => [],
  };
}

sub outputJson {
  my %radicalData = %{ $_[0] };

  my $numRadicals = keys(%radicalData);
  return unless $numRadicals > 0;

  print $output '{';

  my $i = 0;
  while (my ($radical, $data) = each(%radicalData)) {
    my @kanji = @{$data->{relatedKanji}};

    print $output sprintf(
      '"%s":{"strokes":%d,"standard":%s,"kanji":[%s]}',
      $radical,
      $data->{numStrokes},
      $data->{isStandard} ? 'true' : 'false',
      @kanji ? '"' . join('","', @kanji) . '"' : ''
    );

    $i++;
    print $output ',' unless $i == $numRadicals;
  }

  print $output '}';
}

main();

close($output);
