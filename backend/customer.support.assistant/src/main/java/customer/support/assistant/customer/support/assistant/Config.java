package customer.support.assistant.customer.support.assistant;

import com.google.genai.Client;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class Config {

    private static final String API_KEY ="AIzaSyACkMO4vPiq4jYMeSxLIqLFfhsXri2yiBE";
//    Alternative api key = AIzaSyCqb33TYZ2JGzgXN1Rl4Z1B5nVjkGohhdY

    @Bean
    public Client getClient() {
        return Client.builder()
                .apiKey(API_KEY)
                .build();
    }
}
