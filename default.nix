with import <nixpkgs> { };
runCommand "node-machinetalk-example" {
	buildInputs = [
		(avahi.override { withLibdnssdCompat = true; })
		nodejs
		zeromq
	];
} ""