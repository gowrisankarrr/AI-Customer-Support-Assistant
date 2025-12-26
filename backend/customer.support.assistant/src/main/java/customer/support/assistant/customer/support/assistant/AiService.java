package customer.support.assistant.customer.support.assistant;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AiService {
    @Autowired
    Client client;

    public String generateResponse(String userQuery) throws Exception {

        String prompt =
                "You are a professional customer support assistant. " +
                        "Respond politely and clearly. " +
                        "If the issue requires human help, suggest contacting support.\n\n" +
                        "Customer: " + userQuery;
        GenerateContentResponse response =
                client.models.generateContent(
                        "gemini-2.5-flash",
                        prompt,
                        null);

        return formatToPlainText(response.text());
    }

    public String formatToPlainText(String text) {
        if (text == null || text.isEmpty()) return "";

        text = text.replaceAll("^\\*+|\\*+$", "").trim();
        text = text.replaceAll("(\\d+)\\.\\s+", "\n$1. ");
        text = text.replaceAll("([\\*\\-])\\s+", "\n$1 ");
        text = text.replaceAll("\\n{2,}", "\n\n");

        StringBuilder formatted = new StringBuilder();
        String[] lines = text.split("\\n");
        for (String line : lines) {
            formatted.append(line.trim()).append("\n");
        }

        return formatted.toString().trim();
    }
}
