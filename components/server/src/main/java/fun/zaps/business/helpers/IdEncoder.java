package fun.zaps.business.helpers;

import javax.inject.Singleton;
import java.util.LinkedHashMap;
import java.util.Map;

@Singleton
public class IdEncoder {
	private static final char[] ALPHABET = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'};
	private static final char[] SHUFFLED = {'j', 'n', 'd', 'a', '9', 'x', 'r', 'u', 'p', 'g', 'b', '2', 'y', '1', '5', 'h', 'm', 'l', 'z', 'v', 'f', 'q', 'e', 'i', '4', '0', '7', 'o', 's', 'c', '6', 't', 'w', 'k', '8', '3'};

	private static final Map<Character, Character> ENCODE = new LinkedHashMap<>();
	private static final Map<Character, Character> DECODE = new LinkedHashMap<>();

	static {
		for (int i = 0; i < ALPHABET.length; i++) {
			ENCODE.put(ALPHABET[i], SHUFFLED[i]);
			DECODE.put(SHUFFLED[i], ALPHABET[i]);
		}
	}

	public String encode(Long id) {
		StringBuilder builder = new StringBuilder();

		Long.toString(id, Character.MAX_RADIX)
				.chars()
				.mapToObj(c -> (char) c)
				.map(ENCODE::get)
				.forEach(builder::append);

		return builder.reverse().toString();
	}

	public Long decode(String encodedId) {
		StringBuilder builder = new StringBuilder();

		encodedId.chars()
				.mapToObj(c -> (char) c)
				.map(DECODE::get)
				.forEach(builder::append);

		return Long.parseLong(builder.reverse().toString(), Character.MAX_RADIX);
	}

}
