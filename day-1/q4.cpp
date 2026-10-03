#include <stdio.h>
using namespace std;

int main()
{
    int first = 2;
    int second = 2;
    int third = 2;

    if (first == second && first == third)
    {
        printf("all is same number");
        printf("\n");
    }
    else if (first >= second && first >= third)
    {
        printf("first is largest number");
        printf("\n");
    }
    else if (second >= first && second >= third)
    {
        printf("second is largest number");
        printf("\n");
    }
    else
    {
        printf("third is largest number");
        printf("\n");
    }
    return 0;
}