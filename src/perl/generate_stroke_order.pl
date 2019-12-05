# 次のようなファーマットのJSON形式に変換する
# [
#   "一": 0,
#   "丨": 1,
#   "丶": 2,
#   "丿": 3,
#   ...
# ]
#
# 並び替え：画数が少ない順

use strict;
use warnings;

use LWP::Simple qw(get);

die "Usage: $0 url_of_strokes_csv directory/of/output/\n" unless @ARGV == 2;

my $strokesDataUrl = $ARGV[0];
my $outputFilename = "$ARGV[1]/stroke_order.json";

open(my $output, '>:encoding(utf-8)', $outputFilename) or die "Could not open $outputFilename for writing\n";

sub main {
  my $response = get($strokesDataUrl);

  my @kanji = parseResponse($response);

  my @sortedKanji = sort {
    $a->{strokes} <=> $b->{strokes} ||
    $a->{kanji}   cmp $b->{kanji}
  } @kanji;

  outputJson(@sortedKanji);
}

sub parseResponse {
  my $response = shift;

  my @kanjiLines = split("\n", $response);

  my @kanji = ();
  foreach my $line (@kanjiLines) {
    my @matches = ($line =~ /(.)\s+(\d+)/);

    die "Error while parsing $line\n" if !@matches || @matches != 2;

    push(@kanji, {kanji => $matches[0], strokes => $matches[1]});
  }

  return @kanji;
}

sub outputJson {
  my @sortedKanji = @_;

  print $output '{';

  my $numKanji = @sortedKanji;

  for (my $i = 0; $i < $numKanji; $i++) {
    print $output sprintf('"%s":%d', $sortedKanji[$i]->{kanji}, $i);
    print $output ',' unless ($i + 1) == $numKanji;
  }

  print $output '}';
}

main();
