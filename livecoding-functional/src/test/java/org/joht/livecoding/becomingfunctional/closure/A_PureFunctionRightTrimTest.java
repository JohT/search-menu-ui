package org.joht.livecoding.becomingfunctional.closure;

import static org.junit.Assert.assertEquals;

import java.util.Collection;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.Parameterized;
import org.junit.runners.Parameterized.Parameters;

@RunWith(Parameterized.class)
public class A_PureFunctionRightTrimTest {

	private final RightTrimTestCase testCase;

	@Parameters(name = "{0} ({index})")
    public static Collection<Object[]> data() {
        return RightTrimTestCase.all();
    }
	
	public A_PureFunctionRightTrimTest(RightTrimTestCase testCase) {
		this.testCase = testCase;
	}

	@Test
	public void testCaseShouldBeFulfilled() {
		A_PureFunctionRightTrim functionUnderTest = new A_PureFunctionRightTrim();	
		String result = functionUnderTest.apply(testCase.getInput());
		assertEquals(testCase.getExpectedResult(), result);
	}
}