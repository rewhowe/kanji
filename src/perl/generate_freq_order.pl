# 次のようなファーマットのJSON形式に変換する
# [
#   "日": 0,
#   "一": 1,
#   "国": 2,
#   "会": 3,
#   ...
# ]
#
# 並び替え：使用頻度が多い順

use strict;
use warnings;

use lib do {
  (my $dirname = $0) =~ s/\/[^\/]+$/\//;
  $dirname;
};
use Kradfile;

die "Usage: $0 directory/of/kradfiles/ path/to/input/file path/to/output/file/\n" unless @ARGV == 3;

my $kradDirectory  = $ARGV[0];
my $inputFilepath  = $ARGV[1];
my $outputFilepath = $ARGV[2];

open(my $input, '<:encoding(utf-8)', $inputFilepath) or die "Could not open $inputFilepath\n";
open(my $output, '>:encoding(utf-8)', $outputFilepath) or die "Could not open $outputFilepath\n";

sub main {
  my $kradfile = Kradfile->new(directory => $kradDirectory);

  my $i = 0;
  my %kanjiOrder = ();

  while (my $kanji = getc($input)) {
    next unless $kradfile->hasKanji($kanji);

    $kanjiOrder{$kanji} = $i;
    $i++;
  }

  outputJson(\%kanjiOrder);
};

sub outputJson {
  my %kanjiOrder = %{ $_[0] };

  my $numKanji = keys %kanjiOrder;

  print $output '{';

  my $i = 1;
  foreach my $kanji (keys %kanjiOrder) {
    print $output sprintf('"%s":%d', $kanji, $kanjiOrder{$kanji});
    print $output ',' unless ($i + 1) == $numKanji;
    $i++;
  }

  print $output '}';
}

main();

close($input);
close($output);
