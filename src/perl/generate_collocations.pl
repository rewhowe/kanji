# 次のようなファーマットのJSON形式に変換する
# {
#   "ノ": ["人", "大", "二", ...],
#   "一": ["｜", "口", "亅", ...],
#   ...
# }
#
# バリューはキーの部首と同じ漢字に一緒に出る部首の配列

use strict;
use warnings;

use List::MoreUtils qw(uniq);

use constant KRADFILES => ('kradfile', 'kradfile2');

die "Usage: $0 directory/of/kradfiles/ directory/of/output/\n" unless @ARGV == 2;

my $kradDirectory  = $ARGV[0];
my $outputFilename = "$ARGV[1]/collocations.json";

open(my $output, '>:encoding(utf-8)', $outputFilename) or die "Could not open $outputFilename\n";

sub main {
  my $collocationsRef = parseSourceFiles();

  outputJson($collocationsRef);
};

sub parseSourceFiles {
  my %collocations = ();

  foreach my $filename (KRADFILES) {
    open(my $kradfile, '<:encoding(euc-jp)', $kradDirectory . $filename) or die "Could not open $kradDirectory$filename\n";

    while (my $line = <$kradfile>) {
      next if $line =~ /^#/; # skip comments

      my @matches = ($line =~ /^. : (.+)$/);

      die "Error while parsing $line\n" if !@matches || @matches != 1;

      processRadicals(\%collocations, split(' ', $matches[0]));
    }

    close($kradfile);
  }

  return \%collocations;
}

sub processRadicals {
  my ($collocationsRef, @radicals) = @_;

  foreach my $radical (@radicals) {
    foreach my $otherRadical (@radicals) {
      @{$collocationsRef->{$radical}} = () unless exists $collocationsRef->{$radical};

      push(@{$collocationsRef->{$radical}}, $otherRadical);
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
      join('","', @otherRadicals)
    );
    print $output ',' unless ($i + 1) == $numRadicals;
    $i++;
  }

  print $output '}';
}

main();

close($output);
