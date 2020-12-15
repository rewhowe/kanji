# 次のようなファーマットのJSON形式に変換する
# {
#   "ノ": ["人", "大", "二", ...],
#   "一": ["｜", "口", "亅", ...],
#   ...,
#   "ノ一": ["弓", "大", "｜", ...],
# }
#
# キーは独立の部首の場合：バリューはキーの部首を含む漢字に一緒に出る部首の配列
# キーは2つの部首（辞書式順序）の場合：バリューは両方の部首を含む漢字に一緒に出る部首の配列

use strict;
use warnings;

use List::MoreUtils qw(uniq);

use lib do {
  (my $dirname = $0) =~ s/\/[^\/]+$/\//;
  $dirname;
};
use Kradfile;

use constant KRADFILES => ('kradfile', 'kradfile2');

die "Usage: $0 directory/of/kradfiles/ directory/of/output/\n" unless @ARGV == 2;

my $kradDirectory  = $ARGV[0];
my $outputFilename = "$ARGV[1]/collocations.json";

open(my $output, '>:encoding(utf-8)', $outputFilename) or die "Could not open $outputFilename\n";

sub main {
  my $collocationsRef = makeCollocations();

  outputJson($collocationsRef);
};

sub makeCollocations {
  my %collocations = ();

  my $kradfile = Kradfile->new(directory => $kradDirectory);

  foreach my $radicalsRef (values %{$kradfile->{kanji}}) {
    processRadicals(\%collocations, @{$radicalsRef});
  }

  return \%collocations;
}

sub processRadicals {
  my ($collocationsRef, @radicals) = @_;

  foreach my $radical1 (@radicals) {
    foreach my $radical2 (@radicals) {
      next if $radical1 eq $radical2;

      @{$collocationsRef->{$radical1}} = () unless exists $collocationsRef->{$radical1};

      push @{$collocationsRef->{$radical1}}, $radical2;

      my $pair = join '', sort($radical1, $radical2);
      @{$collocationsRef->{$pair}} = () unless exists $collocationsRef->{$pair};

      foreach my $radical3 (@radicals) {
        next if $radical3 eq $radical1 || $radical3 eq $radical2;
        push @{$collocationsRef->{$pair}}, $radical3;
      }
    }
  }
}

sub outputJson {
  my %collocations = %{ $_[0] };

  my $numRadicals = keys %collocations;

  print $output '{';

  my $i = 0;
  foreach my $radical (keys %collocations) {
    my @otherRadicals = uniq @{$collocations{$radical}};

    print $output sprintf(
      '"%s":["%s"]',
      $radical,
      join '","', @otherRadicals
    );
    print $output ',' unless ($i + 1) == $numRadicals;
    $i++;
  }

  print $output '}';
}

main();

close $output;
