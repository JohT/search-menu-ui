package org.joht.livecoding.becomingfunctional.closure;

import java.util.function.Function;
import java.util.regex.Pattern;

// Note: pure function
//
// Note: parameter reduction using currying
public class D_PureFunctionConfigurableUsingCurrying implements Function<Pattern, Function<String, String>> {
	

	@Override
	public Function<String, String> apply(Pattern pattern) {
		return value -> (value != null)? pattern.matcher(value).replaceAll("") : null;
	}
	
	//How to use it:
	public static final String rightTrim(String value) {
		D_PureFunctionConfigurableUsingCurrying function = new D_PureFunctionConfigurableUsingCurrying();
		Pattern rightTrim = Pattern.compile("\\s+$");
		return function.apply(rightTrim).apply(value);
	}
}
