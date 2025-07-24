package com.na.medical_mobile_app.security;


import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.io.FileOutputStream;
import java.io.ObjectOutputStream;

public class AESKeyGenerator {

    public static void main(String[] args) throws Exception {
        KeyGenerator keyGen = KeyGenerator.getInstance("AES");
        keyGen.init(128); // or 256 if supported

        SecretKey secretKey = keyGen.generateKey();

        try (FileOutputStream fos = new FileOutputStream("secret.key");
             ObjectOutputStream oos = new ObjectOutputStream(fos)) {
            oos.writeObject(secretKey);
        }

        System.out.println("AES key generated and saved as secret.key");
    }
}
