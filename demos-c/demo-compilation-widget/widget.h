#ifndef WIDGET_H
#define WIDGET_H
#include <stdbool.h>

/*Forward declaration (type opaque, encapsulation parfaite)*/
typedef struct Widget Widget;

/*Définition d'un type de callback, pointeur sur une fonction*/
typedef void (*WidgetCallback)(void* user_data);

/*API (exposée au client, publique)*/
Widget* widget_create(const char* name, int x, int y, int width, int height);
void    widget_destroy(Widget* w);

void    widget_show(Widget* w);
void    widget_hide(Widget* w);
bool    widget_is_visible(const Widget* w);

void    widget_set_on_click(Widget* w, WidgetCallback cb, void* user_data);


//Rupture ABI
//void    widget_click(Widget* w);


#endif // WIDGET_H