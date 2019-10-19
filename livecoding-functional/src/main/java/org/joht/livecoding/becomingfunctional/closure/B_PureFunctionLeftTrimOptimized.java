package org.joht.livecoding.becomingfunctional.closure;

import java.util.function.UnaryOperator;
import java.util.regex.Pattern;

//Note: alternate implementation
//Note: pure function, but with private static dependency
public class B_PureFunctionLeftTrimOptimized implements UnaryOperator<String> {
	
	private static final Pattern LEFT_TRIM = Pattern.compile("^\\s+");
	
	@Override
	public String apply(String value) {
		if (value == null) {
			return null;
		}
		return LEFT_TRIM.matcher(value).replaceAll("");
	}
	
	//How to use it:
	public static final String leftTrim(String value) {
		B_PureFunctionLeftTrimOptimized function = new B_PureFunctionLeftTrimOptimized();
		return function.apply(value);
	}
}
