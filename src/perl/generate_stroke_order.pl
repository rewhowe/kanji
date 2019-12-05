# 次のようなファーマットのJSON形式に変換する
# [
#   "一": 1,
#   "丨": 2,
#   "丶": 3,
#   "丿": 4,
#   ...
# ]
#
# 並び替え：画数が少ない順

use strict;
use warnings;

use LWP::Simple qw(get);

use lib do {
  (my $dirname = $0) =~ s/\/[^\/]+$/\//;
  $dirname;
};
use Kradfile;

die "Usage: $0 directory/of/kradfiles/ url_of_strokes_csv directory/of/output/\n" unless @ARGV == 3;

my $kradDirectory  = $ARGV[0];
my $strokesDataUrl = $ARGV[1];
my $outputFilename = "$ARGV[2]/stroke_order.json";

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
  my $kradfile = Kradfile->new(directory => $kradDirectory);

  my @kanji = ();
  foreach my $line (@kanjiLines) {
    my @matches = ($line =~ /(.)\s+(\d+)/);

    die "Error while parsing $line\n" if !@matches || @matches != 2;

    next unless $kradfile->hasKanji($matches[0]);

    push(@kanji, {kanji => $matches[0], strokes => $matches[1]});
  }

  return @kanji;
}

sub outputJson {
  my @sortedKanji = @_;

  print $output '{';

  my $numKanji = @sortedKanji;

  for (my $i = 0; $i < $numKanji; $i++) {
    print $output sprintf('"%s":%d', $sortedKanji[$i]->{kanji}, $i + 1);
    print $output ',' unless ($i + 1) == $numKanji;
  }

  print $output '}';
}

main();

close($output);
