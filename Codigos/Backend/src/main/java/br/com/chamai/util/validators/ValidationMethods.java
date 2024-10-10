package br.com.chamai.util.validators;

import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import org.springframework.util.StringUtils;

public class ValidationMethods {
	
	private static final int[] pesoCPF = {11, 10, 9, 8, 7, 6, 5, 4, 3, 2};
  	private static final int[] pesoCNPJ = {6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2};

	public static void main(String[] args) {
		/*
			System.out.println("isValidTelefone => " + isValidTelefone("(62)9849-4081"));
		 */
	}

	public static boolean isValidEmail(String email) {
		if (StringUtils.isEmpty(email)) {
			return false;
		}
		try {
			InternetAddress emailAddress = new InternetAddress(email);
			emailAddress.validate();
		} catch (AddressException ex) {
			return false;
		}
		return true;
	}

	public static boolean isValidTelefone(String telefone) {
		if (StringUtils.isEmpty(telefone)) {
			return false;
		}
		return telefone.matches("(\\(\\d{2}\\))(\\d{4,5}\\-\\d{4})");
	}

	public static boolean isValidCep(String cep) {
		if (StringUtils.isEmpty(cep)) {
			return false;
		}
		return cep.matches("^\\d{5}\\-?\\d{3}$");
	}
	
	public static boolean isValidStringToPersist(String str, int minLength, int maxLength) {
		if (StringUtils.isEmpty(str)) {
			return false;
		}
		return str.length() >= minLength && str.length() <= maxLength;
	}
	
	public static boolean isValidStringToPersist(String str, int maxLength) {
		return isValidStringToPersist(str, 1, maxLength);
	}

	private static int calcularDigito(String str, int[] peso) {
		int soma = 0;
		for (int indice = str.length() - 1, digito; indice >= 0; indice--) {
			digito = Integer.parseInt(str.substring(indice, indice + 1));
			soma += digito * peso[peso.length - str.length() + indice];
		}
		soma = 11 - soma % 11;
		return soma > 9 ? 0 : soma;
	}

	private static String padLeft(String text, char character) {
		return String.format("%11s", text).replace(' ', character);
	}

	public static boolean isValidCPF(String cpf) {
		if (StringUtils.isEmpty(cpf)) {
			return false;
		}
		cpf = cpf.trim().replace(".", "").replace("-", "");
		if ((cpf == null) || (cpf.length() != 11))
			return false;

		for (int j = 0; j < 10; j++)
			if (padLeft(Integer.toString(j), Character.forDigit(j, 10)).equals(cpf))
				return false;

		Integer digito1 = calcularDigito(cpf.substring(0, 9), pesoCPF);
		Integer digito2 = calcularDigito(cpf.substring(0, 9) + digito1, pesoCPF);
		return cpf.equals(cpf.substring(0, 9) + digito1.toString() + digito2.toString());
	}

	public static boolean isValidCNPJ(String cnpj) {
		if (StringUtils.isEmpty(cnpj)) {
			return false;
		}
		cnpj = cnpj.trim().replace(".", "").replace("-", "");
		if ((cnpj == null) || (cnpj.length() != 14))
			return false;

		Integer digito1 = calcularDigito(cnpj.substring(0, 12), pesoCNPJ);
		Integer digito2 = calcularDigito(cnpj.substring(0, 12) + digito1, pesoCNPJ);
		return cnpj.equals(cnpj.substring(0, 12) + digito1.toString() + digito2.toString());
	}

}
