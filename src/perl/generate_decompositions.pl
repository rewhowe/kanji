# 次のようなファーマットのJSON形式に変換する
# {
#   "亜": ["｜", "一", "口"],
#   "唖": ["｜", "一", "口"],
#   ...,
#   "龥": ["一", "｜", "亅", ...],
# }
#
# キーは漢字、バリューはその構成の部首

use strict;
use warnings;

use utf8;

use lib do {
  (my $dirname = $0) =~ s/\/[^\/]+$/\//;
  $dirname;
};
use Kradfile;

use constant KRADFILES => ('kradfile', 'kradfile2');
use constant DISPLAY => {
  '化' => '⺅',
  '个' => '𠆢',
  '并' => '丷',
  '刈' => '⺉',
  '乞' => '𠂉',
  '込' => '⻌',
  '尚' => '⺌',
  '忙' => '⺖',
  '扎' => '⺘',
  '汁' => '⺡',
  '犯' => '⺨',
  '艾' => '⺾',
  '邦' => '⻏',
  '阡' => '⻖',
  '老' => '⺹',
  '杰' => '⺣',
  '礼' => '⺭',
  '疔' => '疒',
  '禹' => '禸',
  '初' => '⻂',
  '買' => '⺲',
  '滴' => '啇',
};

die "Usage: $0 directory/of/kradfiles/ directory/of/output/\n" unless @ARGV == 2;

my $kradDirectory  = $ARGV[0];
my $outputFilename = "$ARGV[1]/decompositions.json";

open(my $output, '>:encoding(utf-8)', $outputFilename) or die "Could not open $outputFilename\n";

sub main {
  my $kradfile = Kradfile->new(directory => $kradDirectory);

  outputJson($kradfile->{kanji});
};

sub outputJson {
  my %kanjis = %{ $_[0] };

  my $numKanji = keys %kanjis;

  print $output '{';

  my $i = 0;
  foreach my $kanji (keys %kanjis) {
    my @radicals = @{$kanjis{$kanji}};

    print $output sprintf(
      '"%s":"%s"',
      $kanji,
      join('', map { DISPLAY->{$_} || $_ } @radicals)
    );

    print $output ',' unless ($i + 1) == $numKanji;
    $i++;
  }

  print $output '}';
}

main();

close $output;
