#include <stdlib.h>
#include <curl/curl.h>

#ifndef APP_VERSION
#define APP_VERSION "no version"
#endif

int main(void) {
    CURL *curl;
    CURLcode res;

    curl_global_init(CURL_GLOBAL_DEFAULT);
    curl = curl_easy_init();
    if(curl) {
        curl_easy_setopt(curl, CURLOPT_URL, "https://api.github.com");
        curl_easy_setopt(curl, CURLOPT_USERAGENT, "myapp/1.0");

        res = curl_easy_perform(curl);
        if(res != CURLE_OK) {
            fprintf(stderr, "curl_easy_perform() failed: %s\n", curl_easy_strerror(res));
        }

        curl_easy_cleanup(curl);
    }
    curl_global_cleanup();
    return 0;
}
