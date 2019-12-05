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

sub main {
  my $kradfile = Kradfile->new(directory => $kradDirectory);
};

main();
