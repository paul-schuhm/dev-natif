#include "widget.h"
#include <stdlib.h>
#include <string.h>
#include <stdio.h>

struct Widget {
    int id;
    char name[64];
    int x, y;
    int width, height;
    bool visible;

    WidgetCallback on_click;
    void* user_data;
};

static int next_id = 1;

Widget* widget_create(const char* name, int x, int y, int width, int height) {
    Widget* w = malloc(sizeof(Widget));
    if (!w) return NULL;

    w->id = next_id++;
    strncpy(w->name, name, sizeof(w->name));
    w->name[sizeof(w->name) - 1] = '\0';
    w->x = x;
    w->y = y;
    w->width = width;
    w->height = height;
    w->visible = false;
    w->on_click = NULL;
    w->user_data = NULL;

    return w;
}

void widget_destroy(Widget* w) {
    if (w) {
        free(w);
    }
}

void widget_show(Widget* w) {
    if (w) w->visible = true;
}

void widget_hide(Widget* w) {
    if (w) w->visible = false;
}

bool widget_is_visible(const Widget* w) {
    return w ? w->visible : false;
}

void widget_set_on_click(Widget* w, WidgetCallback cb, void* user_data) {
    if (w) {
        w->on_click = cb;
        w->user_data = user_data;
    }
}

//Rupture ABI (retirer une fonction de l'API)
// void widget_click(Widget* w) {
//     if (w && w->on_click) {
//         w->on_click(w->user_data);
//     }
// }