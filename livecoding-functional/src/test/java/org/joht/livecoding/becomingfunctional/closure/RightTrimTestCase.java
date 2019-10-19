package org.joht.livecoding.becomingfunctional.closure;

import java.util.Collection;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public enum RightTrimTestCase {

	ALREADY_TRIMMED("abcdefghijklmnopqrstuvwxyz", "abcdefghijklmnopqrstuvwxyz"),
	ONE_RIGHT_SPACE_TO_TRIM("1234567890 ", "1234567890"),
	TWO_RIGHT_SPACES_TO_TRIM("ABCDEFGHIJKLMNOPQRSTUVWXYZ  ", "ABCDEFGHIJKLMNOPQRSTUVWXYZ"),
	TRAILING_LINE_WRAP_TO_TRIM("!§$%&/()=?\n", "!§$%&/()=?"),
	TRAILING_TAB_TO_TRIM("!§$%&/()=?\t", "!§$%&/()=?"),
	TRAILING_CARRIAGE_RETURN_TO_TRIM("!§$%&/()=?\r", "!§$%&/()=?"),
	ONE_STRING_BECOMES_AN_EMPTY_STRING(" ", ""),
	TWO_STRINGS_BECOME_AN_EMPTY_STRING("  ", ""),
	EMPTY_STRING_REMAINS_EMPTY("", ""),
	NULL_REMAINS_NULL(null, null),

	;
	private static final Pattern RIGHT_TRIM_PATTERN = Pattern.compile("\\s+$");

	private final String input;
	private final String expectedResult;

	private RightTrimTestCase(String input, String expectedResult) {
		this.input = input;
		this.expectedResult = expectedResult;
	}

	public String getInput() {
		return input;
	}

	public String getExpectedResult() {
		return expectedResult;
	}

	public Pattern getPattern() {
		return RIGHT_TRIM_PATTERN;
	}
	
	public static final Collection<Object[]> all() {
		return Stream.of(values()).map(testcase -> new Object[] { testcase }).collect(Collectors.toList());
	}
}