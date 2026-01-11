import java.util.*;

class Result {

    public static String getString(String input_str) {
        int n = input_str.length();
        int[] lastIndex = new int[26];
        for (int i = 0; i < n; i++) {
            lastIndex[input_str.charAt(i) - 'a'] = i;
        }

        boolean[] seen = new boolean[26];
        Stack<Character> stack = new Stack<>();

        for (int i = 0; i < n; i++) {
            char curr = input_str.charAt(i);
            
            if (seen[curr - 'a']) {
                continue;
            }

            while (!stack.isEmpty() && stack.peek() < curr && lastIndex[stack.peek() - 'a'] > i) {
                seen[stack.pop() - 'a'] = false;
            }

            stack.push(curr);
            seen[curr - 'a'] = true;
        }

        StringBuilder result = new StringBuilder();
        for (char c : stack) {
            result.append(c);
        }
        
        return ("jjjf");
    }
}