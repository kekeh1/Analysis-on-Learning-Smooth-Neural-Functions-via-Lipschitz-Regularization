#include "fd_interpolate.h"
#include <math.h>

void fd_interpolate(
  const int nx,
  const int ny,
  const int nz,
  const double h,
  const Eigen::RowVector3d & corner,
  const Eigen::MatrixXd & P,
  Eigen::SparseMatrix<double> & W)
{
  ////////////////////////////////////////////////////////////////////////////
  // reference
  // https://www.scratchapixel.com/lessons/mathematics-physics-for-computer-graphics/interpolation/trilinear-interpolation
  //https://eigen.tuxfamily.org/dox/group__TutorialSparse.html
  //http://paulbourke.net/miscellaneous/interpolation/


	typedef Eigen::Triplet<double> T;
	std::vector<T> coefficients;
	int num_p = P.rows();
	coefficients.reserve(8 * num_p);
	

	for (int p = 0; p < num_p; p++) {
		//find ijk
		int i = int(floor((P(p, 0) - corner(0)) / h));
		int j = int(floor((P(p, 1) - corner(1)) / h));
		int k = int(floor((P(p, 2) - corner(2)) / h));

		//find sx,sy,sz
		double sx = ((P(p, 0) - (i * h + corner(0))) / h);
		double sy = ((P(p, 1) - (j * h + corner(1))) / h);
		double sz = ((P(p, 2) - (k * h + corner(2))) / h);

		//set cofficient for g(i, j, k)
		int index = i + j * nx + k * ny * nx;
		coefficients.push_back(T(p, index, (1 - sx) * (1 - sy) * (1 - sz)));
		coefficients.push_back(T(p, index + 1, (sx) * (1 - sy) * (1 - sz)));
		coefficients.push_back(T(p, index + nx, (1 - sx) * (sy) * (1 - sz)));
		coefficients.push_back(T(p, index + ny * nx, (1 - sx) * (1 - sy) * (sz)));
		coefficients.push_back(T(p, index + ny * nx + 1, (sx) * (1 - sy) * (sz)));
		coefficients.push_back(T(p, index + ny + ny * nx, (1 - sx) * (sy) * (sz)));
		coefficients.push_back(T(p, index + nx + 1, (sx) * (sy) * (1 - sz)));
		coefficients.push_back(T(p, index + nx + ny*nx + 1, (sx) * (sy) * (sz)));

	}
	W.resize(num_p, nx * ny * nz);
	W.setFromTriplets(coefficients.begin(), coefficients.end());


  ////////////////////////////////////////////////////////////////////////////
}
