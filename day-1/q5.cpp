#include <stdio.h>
using namespace std;

int main()
{
    int first = 3;
    int second = 3;
    int third = 2;

    if (first == second && first == third)
    {
        printf("all is same number");
        printf("\n");
    }
    else if (first <= second && first <= third)
    {
        printf("first is smallest number");
        printf("\n");
    }
    else if (second <= first && second <= third)
    {
        printf("second is smallest number");
        printf("\n");
    }
    else
    {
        printf("third is smallest number");
        printf("\n");
    }
    return 0;
}