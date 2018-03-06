#!/bin/bash

if [ -z "$VAULT_PASS" ];
	then
	echo "Could not decrypt the vault without key"
	exit 1
fi;

tar -zcvf vault/secret.tar ./vault/secret
gpg --symmetric --passphrase "$VAULT_PASS" vault/secret.tar
if [ "$?" -ne 0 ]; then
	echo "Something went wrong with encryption"
	exit 1
fi

rm ./vault/secret.tar
rm -rf ./vault/secret
