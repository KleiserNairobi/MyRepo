package br.com.chamai.util;

import java.security.spec.AlgorithmParameterSpec;
import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import org.apache.tomcat.util.codec.binary.Base64;

public class EncriptaDecriptaAES {
  
    static String IV = "AAAAAAAAAAAAAAAA";
    public static String ENCRYPT_KEY = "chamai@2020";
 
    public static byte[] encrypt(String textopuro) throws Exception {
        Cipher encripta = Cipher.getInstance("AES/CBC/PKCS5Padding", "SunJCE");
        SecretKeySpec key = new SecretKeySpec(ENCRYPT_KEY.getBytes("UTF-8"), "AES");
        encripta.init(Cipher.ENCRYPT_MODE, key, new IvParameterSpec(IV.getBytes("UTF-8")));
        return encripta.doFinal(textopuro.getBytes("UTF-8"));
    }
 
    public static String decrypt(byte[] textoencriptado) throws Exception{
        Cipher decripta = Cipher.getInstance("AES/CBC/PKCS5Padding", "SunJCE");
        SecretKeySpec key = new SecretKeySpec(ENCRYPT_KEY.getBytes("UTF-8"), "AES");
        decripta.init(Cipher.DECRYPT_MODE, key, new IvParameterSpec(IV.getBytes("UTF-8")));
        return new String(decripta.doFinal(textoencriptado),"UTF-8");
    }
 
    public static String encryptToString(String password) {
        try {
            SecretKey key = new SecretKeySpec(Base64.decodeBase64("u/Gu5posvwDsXUnV5Zaq4g=="), "AES");
            AlgorithmParameterSpec iv = new IvParameterSpec(Base64.decodeBase64("5D9r9ZVzEYYgha93/aUK2w=="));
            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            cipher.init(Cipher.ENCRYPT_MODE, key, iv);
            return Base64.encodeBase64String(cipher.doFinal(password.getBytes("utf-8")));
        } catch (Exception e) {
            System.out.println("Não foi possível descriptar. Erro " + e.getMessage());
        }
        return "";
    }
  
}
