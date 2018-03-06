#!/bin/bash

if [ -z "$VAULT_PASS" ];
	then
	echo "Could not decrypt the vault without key"
	exit 1
fi

gpg --passphrase "$VAULT_PASS" --batch --yes vault/secret.tar.gpg
if [ "$?" -ne 0 ]; then
	echo "Something went wrong with decryption"
	exit 1
fi

tar -zxvf vault/secret.tar
rm vault/secret.tar
