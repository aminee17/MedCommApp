package com.na.medical_mobile_app.security;

import javax.crypto.SecretKey;
import java.io.FileInputStream;
import java.io.ObjectInputStream;

public class CryptoUtils {

    public static SecretKey loadSecretKey() throws Exception {
        try (FileInputStream fis = new FileInputStream("secret.key");
             ObjectInputStream ois = new ObjectInputStream(fis)) {
            return (SecretKey) ois.readObject();
        }
    }
}
