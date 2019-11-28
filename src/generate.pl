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

die "Usage: generate.pl path/to/radkfile\n" unless $ARGV[0];
open(my $radkfile, '<:encoding(euc-jp)', $ARGV[0]) or die "Could not open $ARGV[0]\n";
open(my $output, '>:encoding(utf-8)', 'radicals.json') or die "Could not open radicals.json for writing\n";

sub main {
  my $radicalData = undef;

  print $output '{';

  while (my $line = <$radkfile>) {
    next if $line =~ /^#/; # skip comments

    if ($line =~ /^\$/) {
      outputRadical($radicalData, 0);

      my @matches = ($line =~ /^\$ (.) (\d+)(.+)?$/);

      die "Error while parsing $line\n" if !@matches || @matches < 2;

      $radicalData = makeRadicalData(@matches);
    } else {
      chomp($line);
      push(@{$radicalData->{relatedKanji}}, split('', $line));
    }
  }

  outputRadical($radicalData, 1);

  print $output '}';
}

sub makeRadicalData {
  return {
    radical      => $_[0],
    numStrokes   => $_[1],
    isStandard   => ! defined $_[2],
    relatedKanji => [],
  };
}

sub outputRadical {
  my ($radicalData, $isLast) = @_;

  return unless $radicalData;

  my @kanji = @{$radicalData->{relatedKanji}};

  print $output sprintf(
    '"%s":{"strokes":%d,"standard":%s,"kanji":[%s]}',
    $radicalData->{radical},
    $radicalData->{numStrokes},
    $radicalData->{isStandard} ? 'true' : 'false',
    @kanji ? '"' . join('","', @kanji) . '"' : ''
  );

  print $output ',' unless $isLast;
}

main();

close($radkfile);
close($output);
