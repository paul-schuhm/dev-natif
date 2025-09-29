
//Pointeur opaque stricte.
typedef void car;
void set_price(car* c, float price);
void* object_car_create();
void object_car_destroy(car*);
void object_car_print(car* c);
