package org.joht.livecoding.becomingfunctional.closure;

import java.util.function.UnaryOperator;
import java.util.regex.Pattern;

public class F_OneLineClosureFunctionConfigurable  {

	private static final Pattern STANDARD_RIGHT_TRIM_PATTERN = Pattern.compile("\\s+$");
	public static final UnaryOperator<String> TRIM_FUNCTION = F_OneLineClosureFunctionConfigurable.ofPattern(STANDARD_RIGHT_TRIM_PATTERN);

	public static final UnaryOperator<String> ofPattern(Pattern pattern) {
		return text -> (text != null)? pattern.matcher(text).replaceAll("") : null;
	}
	
	public static final UnaryOperator<String> standardRightTrim() {
		return TRIM_FUNCTION;
	}
}