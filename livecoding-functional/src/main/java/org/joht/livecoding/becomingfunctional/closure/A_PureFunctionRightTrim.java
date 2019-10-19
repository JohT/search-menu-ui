package org.joht.livecoding.becomingfunctional.closure;

import java.util.function.UnaryOperator;

//Note: pure: 
//Its return value is the same for the same arguments.
//Its evaluation has no side effects. 

//Note: could also be implemented as static util (imperal style)

//Note: only fits into object oriented paradigm because of interface.
public class A_PureFunctionRightTrim implements UnaryOperator<String> {
	
	@Override
	public String apply(String value) {
		if (value == null) {
			return null;
		}
		return value.replaceAll("\\s+$","");
	}
	
	//How to use it:
	public static final String rightTrim(String value) {
		A_PureFunctionRightTrim function = new A_PureFunctionRightTrim();
		return function.apply(value);
	}
}
