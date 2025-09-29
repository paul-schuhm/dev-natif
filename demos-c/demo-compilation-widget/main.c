#include <stdio.h>
#include "widget.h"


void on_click_handler(void* data) {
    printf("Widget clicked! Message: %s\n", (char*)data);
}

int main() {
    Widget* w = widget_create("DemoWidget", 10, 20, 100, 50);
    widget_set_on_click(w, on_click_handler, "Hello from Widget!");

    widget_show(w);
    printf("Is widget visible? %s\n", widget_is_visible(w) ? "Yes" : "No");

    //widget_click(w);
    widget_destroy(w);
    return 0;
}
