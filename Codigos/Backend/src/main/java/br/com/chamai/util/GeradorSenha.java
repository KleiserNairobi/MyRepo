package br.com.chamai.util;

import java.io.UnsupportedEncodingException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.spec.AlgorithmParameterSpec;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GeradorSenha {

	public static void main(String[] args) throws NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException, InvalidAlgorithmParameterException, IllegalBlockSizeException, BadPaddingException, UnsupportedEncodingException {
		/*
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		System.out.println(encoder.encode("senha"));
		System.out.println("");
		*/
		
		String plainText = "duarte123";
		SecretKey key = new SecretKeySpec(
		Base64.decodeBase64("u/Gu5posvwDsXUnV5Zaq4g=="), "AES");
		AlgorithmParameterSpec iv = new IvParameterSpec(Base64.decodeBase64("5D9r9ZVzEYYgha93/aUK2w=="));
		Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
		cipher.init(Cipher.ENCRYPT_MODE, key, iv);
		System.out.println("Senha encriptada => " + Base64.encodeBase64String(cipher.doFinal(plainText.getBytes("utf-8"))));
	}
}
